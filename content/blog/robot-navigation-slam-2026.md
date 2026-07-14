---
title: "How Service Robots Navigate: SLAM, Sensor Fusion, and the AI Stack Behind Autonomous Movement"
date: "2026-07-13"
category: "Technology"
description: "A deep dive into the navigation technology stack that powers modern service robots — from lidar and depth cameras to SLAM algorithms and edge AI decision-making in dynamic environments."
coverImage: "/images/home/hero-robot.webp"
diagramImage: "/images/products/aoman-double/tech-drawing.webp"
---

When a delivery robot glides through a hotel lobby, dodges a suitcase, waits for an elevator, and arrives precisely at room 1217 — it's executing one of the hardest problems in robotics: autonomous navigation in an unstructured, human-populated environment.

The engineering behind this seemingly simple behavior draws on decades of research in simultaneous localization and mapping (SLAM), sensor fusion, path planning, and edge AI. Here's what's inside the stack.

## The Core Problem: Where Am I, and Where Is Everything Else?

Autonomous navigation boils down to three questions, asked continuously at 10–30 Hz:

1. **Localization**: Where am I right now, within an error margin of < 5 cm?
2. **Mapping**: What does the environment look like, including obstacles I've never seen before?
3. **Planning**: What's the safest, most efficient path to my destination, given what I know?

These three problems are interdependent — you can't localize without a map, and you can't build a map without accurate localization. The solution is SLAM: solving both problems simultaneously.

## The Sensor Suite: More Than Just Cameras

A production service robot like the [CADEBOT L100](/products/cadebot-l100) carries a multi-modal sensor package that costs more than the motors and chassis combined:

### Lidar (Light Detection and Ranging)

The primary navigation sensor. A typical unit uses a 360° scanning laser with:
- **Range**: 25–40 meters for indoor models
- **Resolution**: Angular resolution of 0.1°–0.3°, generating 1,200–3,600 points per rotation
- **Update rate**: 10–15 Hz
- **Accuracy**: ±2–3 cm at 10 meters

Lidar excels at geometric mapping — walls, doors, furniture — but struggles with transparent surfaces (glass walls, windows) and featureless corridors (long empty hallways where every scan looks similar).

### Depth Cameras (RGB-D)

Stereo or time-of-flight depth cameras complement lidar by capturing:
- **Visual features**: Textures, patterns, signage — essential for place recognition and loop closure
- **Short-range depth**: 0.3–5 meter range at millimeter precision for obstacle detection
- **Object classification**: Identifying people, luggage, carts, and other dynamic objects

Most service robots use 2–4 depth cameras for 360° short-range coverage, with the forward-facing pair providing the highest resolution for path planning.

### Ultrasonic and Infrared

Low-cost proximity sensors fill the gaps that lidar and cameras miss:
- **Glass detection**: Ultrasonic sensors reflect off glass surfaces that lidar passes through
- **Cliff detection**: Infrared sensors prevent robots from driving down stairs or off ledges
- **Low-profile objects**: Detecting items below lidar scan height (pets, cables, low furniture)

### IMU (Inertial Measurement Unit)

A 9-axis IMU (accelerometer + gyroscope + magnetometer) provides:
- **Odometry between scans**: Bridging the 50–100 ms gaps between lidar frames
- **Elevator detection**: Sensing vertical movement to confirm floor changes
- **Bump detection**: Identifying collisions that visual sensors might miss

## SLAM: The Mathematical Core

SLAM algorithms process sensor data into two outputs that update simultaneously:

### Graph-based SLAM (Modern Approach)

Most commercial service robots use graph-based SLAM, which represents the robot's trajectory and observed landmarks as a graph optimization problem:

1. **Nodes**: Robot poses at different timestamps (x, y, θ)
2. **Edges**: Spatial constraints between poses — derived from odometry (how far did I move?) and loop closures (have I been here before?)
3. **Optimization**: The algorithm minimizes the error across all constraints using sparse linear algebra (typically Levenberg-Marquardt or Gauss-Newton methods)

The breakthrough that made graph-based SLAM practical was the realization that the constraint matrix is sparse — most poses constrain only a few others — reducing computational complexity from O(n³) to near O(n).

### Visual SLAM (vSLAM)

An alternative approach using primarily camera data, vSLAM tracks visual features (corners, edges, textures) across frames. The advantage is lower sensor cost; the disadvantage is sensitivity to lighting changes and feature-poor environments. Most commercial robots use a hybrid approach: lidar for geometric mapping, visual features for place recognition and loop closure.

## Path Planning: From Global to Local

Once a robot knows where it is, it needs to decide how to move. Modern robots use a two-tier planning architecture:

### Global Planning (The Route)

A global planner computes the optimal route from current position to destination across the full map, using algorithms like A* or Dijkstra on a costmap — a grid representation where each cell has a traversal cost. Dynamic obstacles (people, temporary objects) are added as high-cost regions in real-time.

### Local Planning (The Execution)

A local planner executes the global route in 1–3 second windows, handling:
- **Dynamic obstacle avoidance**: Re-routing around moving people using velocity obstacle algorithms
- **Social navigation**: Following culturally appropriate passing distances (typically 50–80 cm) and yielding to pedestrians in narrow corridors
- **Smooth trajectories**: Generating velocity commands that minimize jerk for passenger comfort (important for robots carrying food or liquids)

## Edge AI: Running the Stack On-Board

All of the above — sensor fusion, SLAM, path planning — runs on an edge computing module inside the robot, typically an NVIDIA Jetson or Qualcomm RB5 platform:

- **Inference**: 10–30 TOPS for real-time object detection and scene understanding
- **Power budget**: 15–30W for the compute module, 60–120W total including motors and sensors
- **Latency requirement**: < 100 ms end-to-end from sensor input to motor command

Cloud connectivity is used for fleet coordination, remote monitoring, and map sharing — but navigation decisions remain local. A robot that needs an internet connection to avoid a pedestrian is not robust enough for deployment.

## What This Means for Buyers

When evaluating service robots, navigation capability should be a primary criteria — not an afterthought. Key questions to ask vendors:

- **What sensors does the robot use?** Lidar + depth cameras + ultrasonic is the gold standard. Single-sensor systems (camera-only or lidar-only) have known failure modes
- **What's the mapping process?** Look for robots that can map a new floor in under 30 minutes with a single walkthrough
- **How does it handle glass walls and atriums?** This is the #1 failure mode for lidar-only systems. The robot should have ultrasonic or camera-based glass detection
- **What's the recovery behavior?** When the robot gets confused (and all robots do occasionally), does it stop safely and call for help, or does it guess and risk a collision?
- **Multi-floor support**: VDV (vertical delivery vehicle) integration for elevators requires specific protocols. Ask for a compatibility assessment with your building's elevator system

The navigation stack is the single most important engineering investment in any service robot — more than the chassis, more than the battery, more than the interface. It's what separates robots that work reliably in production from robots that work in demos.

[AOMAN FUTURE](/technology) robots use a proprietary multi-sensor SLAM stack with lidar, stereo depth, ultrasonic, and 9-axis IMU fusion, running on an edge AI module that handles all navigation decisions locally at sub-100ms latency.

[Contact us](/contact) for a technical deep-dive or on-site navigation demonstration.
