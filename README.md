# watch-mode-visualizer

> Interactive web app for the watch modding community — mix and match cases, dials, and hands in real time, featuring an on-demand AI pipeline that extracts physical watch components from raw smartphone photos into clean, transparent vector layers.

**Status:** 🚧 In active development. Architecture and CI/CD pipelines below reflect the active production build plan.

---

## What It Does

Watch modding (building custom watches from interchangeable components) is a visual, trial-and-error hobby — collectors currently iterate by eyeballing part photos in flat image editors or forum threads. This application provides an authentic, interactive workbench: drag cases, movements, dials, and hands together on an active canvas while calculating running price estimations. Components stack, sort, and scale proportionally based on actual physical dimensions (e.g., auto-scaling a 30.5mm dial vs. a 28.5mm dial accurately inside an identical casing profile).

The core differentiator is the processing pipeline: instead of offering only a static library of pre-rendered part images, users can upload a real smartphone photo of a component resting on a messy background. The backend flattens perspective warps and executes object segmentation, turning raw photography into an isolated, transparent layer ready for canvas assembly.

## Why This Project

Watch modding is a personal creative pursuit — building and modding watches requires distinct attention to micro-dimensions, and this project scratches a specific horological itch. 

From an engineering perspective, this platform pairs cloud infrastructure optimization with applied computer vision. It implements an asynchronous machine learning pipeline utilizing a lightweight segmentation model (**MobileSAM**) behind a reactive, cost-optimized deployment pipeline. The repository demonstrates a production-shaped cloud architecture balancing real-world ML tradeoffs: model loading times, CPU memory limitations, and zero-idle hosting methodologies.

---

## Architecture Matrix

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | React (Vite) + Tailwind CSS | UI workspace shell — sidebar, part library controls, asset loading states |
| **Canvas Engine** | Fabric.js / HTML5 Canvas | Z-indexed stack rendering, layer sorting, and hand alignment calibration |
| **Authentication** | Native Supabase Auth | Secure user identity sessions and live portfolio sync profiles |
| **Static Delivery** | Amazon S3 + CloudFront | Serves compiled React production build bundles across global edge paths |
| **Backend API** | Python (FastAPI) | Handles payloads, readiness gates, and orchestrates ML inference |
| **Computer Vision** | OpenCV | Perspective correction matrices (flattens angled photography) |
| **Segmentation** | MobileSAM (Meta AI) | Edge-point background removal and individual asset isolation |
| **Compute Core** | Amazon EC2 (`t3.medium`) | Hosts warm FastAPI application runtime processes and PyTorch models |
| **Data Store** | PostgreSQL (Supabase) | Relational part manifests, physical dimensions, and saved user builds |

### High-Level System Overview

[React + Fabric.js] ──HTTP──► [FastAPI on EC2] ──► [OpenCV: perspective warp]
▲                                                    │
│                                          [MobileSAM: background removal]
│                                                    │
└─────────────── transparent PNG layer ◄─────────────┘

[React] ◄──Direct Read──► [Supabase Postgres]   (Part Manifests, Saved Portfolio Builds)


---

## 🛠️ Compute-on-Demand AI Infrastructure Automation

To completely eliminate idle hosting fees associated with dedicated machine learning servers, the application utilizes an event-driven serverless-to-compute edge bridge. By decoupling the heavy computer vision workloads from continuous billing cycles, the system maintains a **near-zero cost baseline** when inactive, scaling instantly to a warm EC2 instance the moment a user initiates a workshop session.

### Infrastructure Topology

              ┌───────────────────────────────┐
              │ Browser Frontend Client Request│
              └───────────────┬───────────────┘
                              │
                              ▼
                ┌───────────────────────────┐
                │  CloudFront Distribution  │
                └─────────────┬─────────────┘
                              │
         ┌────────────────────┴────────────────────┐
Primary   │ (Active HTTP 200)                       │ Fallback (Timeout 502/503)
─────────►▼                                         ▼◄────────
┌───────────────┐                         ┌───────────────┐
│  EC2 Engine   │                         │   S3 Bucket   │
│   (FastAPI)   │                         │ (Loading Page)│
└───────────────┘                         └───────┬───────┘
│ (Fires background ping)
▼
┌───────────────┐
│  API Gateway  │
└───────┬───────┘
│ (Invokes)
▼
┌───────────────┐
│ AWS Lambda    │
└───────┬───────┘
│ (Starts Node)
▼
┌───────────────┐
│  EC2 Node On  │
└───────────────┘


### End-to-End Execution Lifecycle

1. **Cold State & Traffic Interception** The AI backend resides in a **Stopped** power state on an AWS EC2 instance running Ubuntu Server 24.04 LTS, accruing zero runtime compute fees. When a browser initiates a request to the `/api/*` path behavior, the global **AWS CloudFront Distribution** attempts to establish a gateway connection with the primary EC2 compute origin.
2. **Serverless Failover Routing & Lambda Awakening** Upon tracking an unreachable gateway timeout (`502/503/504 Error`), CloudFront executes an **Origin Group Failover Policy**. Traffic instantly shifts to a secondary static **S3 Fallback Bucket** serving an optimized, dark-themed loading interface. Upon initial render, this page dispatches an asynchronous background ping against an **AWS API Gateway**, invoking an **AWS Lambda Python function** configured with scoped IAM permissions to execute an operational `ec2:StartInstances` command.
3. **Singleton Model Serialization & Readiness Hooking** While the virtual machine boots, the loading page continuously polls the backend’s `/api/health` path. To maximize performance on standard CPU hardware, the backend **FastAPI** application encapsulates the heavy MobileSAM weight matrices within an asynchronous **Singleton Lifespan Handler**. The model weights are loaded into RAM exactly *once* during Uvicorn initialization. The readiness probe returns a strict `503 Service Unavailable` status until serialization concludes, switching to an HTTP `200 OK` only when the model is ready for matrix inference. The polling client intercepts this status flip and forces a browser hard reload to establish a direct workspace connection.
4. **Automated CloudWatch Idle-Teardown** An **AWS CloudWatch Metric Alarm** monitors performance metrics to spin down infrastructure safely when a session ends. The alarm evaluates the **`Maximum CPUUtilization`** across a rolling 15-minute window (3 consecutive 5-minute evaluation stages). If maximum CPU metrics stay entirely **below 5%**—indicating user interaction has ceased and the browser workspace has closed—CloudWatch executes an administrative stop policy, parking the server back down to its zero-billing resting layer.

---

## CI/CD Pipeline Lifecycle

Local Workspace ──git push──► GitHub Repository ──► GitHub Actions (OIDC Federation)
│
┌───────────────────────────┴───────────────────────────┐
▼                                                       ▼
Frontend Pipeline                                       Backend Pipeline
• Compile Production Assets (Vite)                      • Push Source to EC2
• Sync Build Matrix to Amazon S3                        • Refresh Uvicorn ASGI Process


Authentication to AWS utilizes **OIDC Federation** roles rather than long-lived, static access keys stored inside GitHub Secrets, ensuring compliance with modern DevSecOps identity rotation principles.

## Engineering Decisions & Tradeoffs

- **MobileSAM over Full SAM Matrix:** MobileSAM delivers a dramatically condensed memory footprint, allowing it to execute inference quickly within a cost-effective CPU compute layer rather than requiring dedicated GPU acceleration instances.
- **EC2 vs. Pure Lambda for Inference Pipelines:** OpenCV data transformations combined with model initialization processes benefit from a persistent process memory space. Cold-starting multiple megabytes of deep learning model layers inside an ephemeral Lambda execution context would crivel user response latency and incur massive runtime execution timeouts.
- **Supabase PostgreSQL from Day One:** Choosing a relational engine over simple client-side files avoids data-layer migration paths when multiple concurrent users store custom watch assembly dimensions or synchronize portfolios simultaneously.
- **Manual-Assist CV Input Processing:** Fully automated edge detection can fail on highly reflective brushed steel and sapphire surfaces. Version 1 utilize manual user anchor constraints (taping casing corners and dial center points) to establish reliable perspective flattens before executing the underlying machine learning layers.

## Project Roadmap

- [x] Canvas core mechanics — drag, scale, rotate, and layer stack sorting
- [x] Part inventory dictionary matrix + dimension-proportional vector scaling
- [x] Native Supabase Auth session states + live Postgres portfolio synchronization
- [x] Compute-on-Demand serverless awakening infrastructure loop and CloudWatch idle-teardown
- [ ] AI image processing pipeline integration (v1: Manual-assist perspective correction + background segmentation)
- [ ] AI image processing pipeline optimization (v2: Full edge-detection automation)
- [ ] GitHub Actions OIDC deployment pipelines for automated S3 and EC2 synchronizations

## License

This project is licensed under the terms of the **MIT License**.