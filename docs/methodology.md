# CrashLens Mathematical & Machine Learning Methodology

## 1. Unsupervised Spatial Clustering

Road accident hotspot detection is fundamentally an unsupervised spatial learning challenge:
- Historical collision databases provide incident coordinates $(lat_i, lon_i)$ and injury severity outcomes, but no pre-existing ground-truth cluster labels.
- The objective is discovering non-random spatial density concentrations that diverge from sparse background traffic occurrence.

## 2. Spherical Haversine Distance vs Planar Euclidean Distance

Planar Euclidean distance $\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$ assumes a flat Cartesian coordinate plane.
On the ellipsoidal surface of the Earth, meridians of longitude converge toward the poles:
- At the equator ($0^\circ$), $1^\circ$ of longitude spans approximately $111.32\text{ km}$.
- At Greater London ($51.5^\circ\text{N}$), $1^\circ$ of longitude spans only $69.30\text{ km}$ ($\cos(51.5^\circ) \approx 0.6225$).
- Conversely, $1^\circ$ of latitude remains approximately constant at $111.2\text{ km}$.

If Euclidean distance is calculated directly on decimal degrees, east-west distances are exaggerated by over 60%, severely warping circular neighborhood kernels into tall vertical ellipses.

CrashLens implements the spherical **Haversine formula** using the mean Earth radius constant $R = 6,371.0088\text{ km}$:

$$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1) \cdot \cos(\phi_2) \cdot \sin^2\left(\frac{\Delta \lambda}{2}\right)$$
$$c = 2 \cdot \text{atan2}(\sqrt{a}, \sqrt{1-a})$$
$$d = R \cdot c$$

Where $\phi$ denotes latitude in radians and $\lambda$ denotes longitude in radians.

## 3. Density-Based Clustering (DBSCAN)

CrashLens deploys DBSCAN (Density-Based Spatial Clustering of Applications with Noise) as its primary detection engine:
- **Epsilon Distance ($eps$):** Neighborhood search radius. Configured to $0.25\text{ km}$ ($250\text{ meters}$), converted to angular distance:
  $$eps_{rad} = \frac{eps_{km}}{R} = \frac{0.25}{6371.0088} \approx 3.924 \times 10^{-5}\text{ radians}$$
- **Minimum Samples ($min\_samples$):** Core density threshold, set to $8$ collisions within the $250\text{ m}$ radius.
- **Noise Classification:** Solitary collisions that fail density reachability criteria are assigned label $-1$. In Greater London (2022), DBSCAN identified $9,191$ noise collisions ($35.31\%$), cleanly separating isolated crashes from the $432$ dangerous hotspot zones ($64.69\%$).

## 4. Severity Weighting Formula

Raw crash counts alone fail to reflect societal harm. A single fatal incident carries vastly higher urgency than multiple minor fender-benders.
CrashLens applies a transparent, documented severity weighting formula:

$$\text{Severity Score} = (10 \cdot C_{\text{fatal}}) + (4 \cdot C_{\text{serious}}) + (1 \cdot C_{\text{slight}})$$

Clusters are classified into four actionable civil priority tiers:
- **Critical:** Severity Score $\ge 40$ or Total Collisions $\ge 25$
- **High:** Severity Score $\ge 20$ or Total Collisions $\ge 14$
- **Moderate:** Severity Score $\ge 10$ or Total Collisions $\ge 7$
- **Emerging:** Severity Score $< 10$

