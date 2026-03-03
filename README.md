# Static Website Deployment on Azure — Group 5

> [!IMPORTANT]
> **Project Status:** The Azure Virtual Machine associated with this deployment has been **deallocated (shut down)** to manage cloud costs and preserve credits.
>
> **Evidence of Deployment:** > Please refer to the `/screenshots` directory in this repository to view the live site in action, the NGINX configuration, and the successful Azure CLI provisioning logs.

A static portfolio website built with **React + Vite + TypeScript**, deployed to an **Azure Virtual Machine** in the South Africa North region, served via **NGINX**, and fully automated with **GitHub Actions CI/CD**.


---

##  Screenshots

### Landing Page
![Landing Page](./screenshots/screenshot%20of%20the%20landing%20page%20of%20the%20website.png)

### Home Page Preview
![Home Page](./screenshots/preview%20of%20the%20hiome%20page%20of%20the%20static%20website.png)

### Successful GitHub Actions Workflow Run
![Successful Workflow](./screenshots/preview%20of%20successful%20workflow%20run.png)

### Azure VM Provisioning & NGINX Setup (1 of 2)
![Azure Provisioning Part 1](./screenshots/screnshot%201%20showing%20provisionaing%20of%20vm%20and%20set%20up%20nginx%20server.png)

### Azure VM Provisioning & NGINX Setup (2 of 2)
![Azure Provisioning Part 2](./screenshots/screnshot%202%20showing%20provisionaing%20of%20vm%20and%20set%20up%20nginx%20server.png)

---

##  Repository Structure

```
portfolio-react/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline
├── scripts/
│   ├── provision.sh            # Azure infrastructure provisioning script (CLI)
│   └── setup-nginx.sh          # Idempotent NGINX install & config script
├── src/                        # React application source code
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Page-level components
│   └── main.tsx                # Application entry point
├── screenshots/                # Documentation screenshots
├── nginx.conf                  # Reference NGINX server block config
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite build configuration
├── package.json                # Node.js project manifest
└── README.md                   # This documentation file
```

---

##  Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Developer                             │
│                   git push → main branch                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ triggers
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  GitHub Actions Runner                        │
│  1. Checkout code                                            │
│  2. Node.js 20 setup + npm ci                                │
│  3. npm run build  →  /dist                                  │
│  4. SSH key setup (from GitHub Secrets)                      │
│  5. Run setup-nginx.sh on VM (idempotent)                    │
│  6. rsync dist/ → VM:/var/www/portfolio/                     │
│  7. sudo systemctl reload nginx                              │
│  8. curl health-check (HTTP 200 assertion)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ SSH / rsync
                           ▼
┌─────────────────────────────────────────────────────────────┐
│        Azure VM: static-vm (South Africa North)              │
│        Ubuntu 24.04 LTS — Standard_B2ats_v2                  │
│                                                              │
│   ┌─────────────────────────────────────────────┐           │
│   │  Resource Group: group-cloud-project         │           │
│   │  VNet: static-vnet  (10.0.0.0/16)           │           │
│   │  Subnet: static-subnet  (10.0.1.0/24)        │           │
│   │  NSG: static-nsg                             │           │
│   │    ├── Allow SSH  (port 22 inbound)          │           │
│   │    ├── Allow HTTP (port 80 inbound)          │           │
│   │    └── Allow HTTPS (port 443 inbound)        │           │
│   └─────────────────────────────────────────────┘           │
│                                                              │
│   NGINX serves /var/www/portfolio on port 80                 │
│   97                                    │
└─────────────────────────────────────────────────────────────┘
```

---

##  Cloud Infrastructure

| Resource          | Name                   | Details                          |
|-------------------|------------------------|----------------------------------|
| Resource Group    | `group-cloud-project`  | South Africa North               |
| Virtual Network   | `static-vnet`          | 10.0.0.0/16                      |
| Subnet            | `static-subnet`        | 10.0.1.0/24                      |
| NSG               | `static-nsg`           | Ports: 22, 80, 443 (inbound)     |
| Virtual Machine   | `static-vm`            | Ubuntu 24.04 LTS, Availability Zone 1 |
| VM Size           | `Standard_B2ats_v2`    | 2 vCPUs, 1 GiB RAM               |
| OS Disk           | Premium LRS            | 30 GB                            |
| Security Type     | Trusted Launch          | Secure Boot + vTPM               |
| Public IP         | `4.222.216.97`         | Standard SKU                     |
| Web Server        | NGINX                  | Latest (Ubuntu package)          |


---

##  Tech Stack

### Website
| Technology        | Version     | Purpose                        |
|-------------------|-------------|--------------------------------|
| React             | 18.3.x      | UI Framework                   |
| TypeScript        | 5.5.x       | Type safety                    |
| Vite              | 5.4.x       | Build tool & dev server        |
| React Router DOM  | 6.26.x      | Client-side routing (SPA)      |
| Tailwind CSS      | 3.4.x       | Utility-first styling          |
| Radix UI          | Various     | Accessible component primitives|
| Lucide React      | 0.462.x     | Icon library                   |

### Infrastructure & DevOps
| Tool              | Purpose                              |
|-------------------|--------------------------------------|
| Azure CLI         | Automated infrastructure provisioning|
| Azure VM          | Cloud compute (Ubuntu 24.04)         |
| NGINX             | Web server for static files          |
| rsync             | Efficient file sync to VM            |
| GitHub Actions    | CI/CD pipeline automation            |
| SSH               | Secure remote access & deployment    |

---

##  Deployment Pipeline (GitHub Actions)

The pipeline in `.github/workflows/deploy.yml` automatically triggers on every push to `main`:

| Step | Name                        | Description                                                   |
|------|-----------------------------|---------------------------------------------------------------|
| 1    | Checkout repository         | Fetches the latest code                                       |
| 2    | Set up Node.js 20           | Installs Node.js with npm cache                               |
| 3    | Install dependencies        | Runs `npm ci` for a clean install                             |
| 4    | Build                       | Runs `npm run build` to produce the `/dist` folder            |
| 5    | Setup SSH key               | Writes the private key from Secrets and scans known_hosts     |
| 6    | Configure NGINX on VM       | Copies and runs `setup-nginx.sh` (idempotent — skips if done)|
| 7    | Deploy to VM via rsync      | Syncs `dist/` → `/var/www/portfolio/` on the VM              |
| 8    | Reload NGINX                | Reloads NGINX config to serve new files                       |
| 9    | Verify site is live         | Asserts HTTP 200 from the public IP via `curl`                |

### GitHub Secrets Required

| Secret Name         | Description                                      |
|---------------------|--------------------------------------------------|
| `VM_SSH_PRIVATE_KEY`| RSA private key matching the VM's authorized key |
| `VM_HOST`           | Public IP address of the VM (`4.222.216.97`)    
                

---

## Scripts

### `scripts/provision.sh` — Azure Infrastructure Provisioning
This script provisions the **complete Azure infrastructure from scratch** using the Azure CLI. It is intended to be run once by a developer who has `az login` completed.

```bash
# Prerequisites: Azure CLI installed and logged in
bash scripts/provision.sh
```

**What it creates (in order):**
1. Resource Group (`group-cloud-project`) in `southafricanorth`
2. Virtual Network (`static-vnet`) with address space `10.0.0.0/16`
3. Subnet (`static-subnet`) with prefix `10.0.1.0/24`
4. Network Security Group (`static-nsg`)
5. NSG Inbound Rules: SSH (22), HTTP (80), HTTPS (443)
6. Associates NSG with the subnet
7. Deploys the Linux VM (`static-vm`) with Ubuntu 24.04 LTS
8. Opens ports 80 and 443 on the VM NIC

---

### `scripts/setup-nginx.sh` — NGINX Server Setup (Idempotent)
This script **installs and configures NGINX** on the VM. It is safe to run multiple times — if NGINX and the portfolio config are already in place, it exits immediately without making any changes.

```bash
# Run locally over SSH once:
ssh -i static-_key.pem creeksonjoseph@4.222.216.97 'bash -s' < scripts/setup-nginx.sh

# Or it's automatically run by the GitHub Actions pipeline
```

**What it does:**
- Checks if NGINX and `/etc/nginx/sites-available/portfolio` already exist → skips if yes
- Updates package list and installs NGINX
- Creates and chowns `/var/www/portfolio` web root
- Writes the NGINX server block for SPA support, caching, gzip, and security headers
- Enables the site, disables the default site
- Enables and starts the NGINX service
- Configures UFW firewall (`OpenSSH`, `Nginx HTTP`)

---

##  NGINX Configuration

NGINX is configured to serve the React SPA with:

- **SPA Support** — All routes fall back to `index.html` so React Router works correctly
- **Asset Caching** — `.js`, `.css`, images, and fonts get 1-year `Cache-Control: immutable`
- **Gzip Compression** — Reduces transfer size for text-based assets
- **Security Headers** — `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`
- **Port 80** — HTTP traffic (public access)

---

##  Security

- SSH password authentication is **disabled** on the VM; only the provisioned public key is accepted.
- VM uses **Trusted Launch** with Secure Boot and vTPM enabled.
- `githubsecrets.env` and `*.pem` SSH keys are listed in `.gitignore` and are **never committed to the repository**.
- Secrets are stored in **GitHub Actions Secrets** and injected at runtime only.
- NSG restricts inbound traffic to ports 22 (SSH), 80 (HTTP), and 443 (HTTPS).

---

##  Local Development

```bash
# Clone the repository
git clone <repo-url>
cd portfolio-react

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

##  Design Choices & Decision Log

| Decision | Choice Made | Rationale |
|----------|-------------|-----------|
| Cloud Provider | Azure | Familiar ecosystem; rich CLI tooling |
| Region | South Africa North | Geographic proximity for the team |
| Web Server | NGINX | Lightweight, performant for static files, widely supported |
| Build Tool | Vite | Extremely fast builds vs. CRA/Webpack |
| CI/CD | GitHub Actions | Native GitHub integration; free for public repos |
| Deployment Method | rsync over SSH | Efficient delta sync without requiring cloud-specific tooling |
| Script Design | Idempotent | Safe for repeated runs; avoids accidental re-provision |

### Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| NGINX setup needed only once but CI runs every deploy | Made `setup-nginx.sh` idempotent — checks and exits if already configured |
| VM SSH key management in CI | Stored private key as a GitHub Secret; injected at runtime with `chmod 600` |
| React Router 404s on page refresh | NGINX `try_files $uri $uri/ /index.html` directive handles all SPA routes |
| Deploying only changed files efficiently | Used `rsync --delete` for minimal data transfer on incremental updates |

---


