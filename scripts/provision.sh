#!/bin/bash
# =============================================================================
# provision.sh — Azure Infrastructure Provisioning Script
# Project 5: Static Website Deployment — Group 5
# =============================================================================
# Usage: bash scripts/provision.sh
# Prerequisites: Azure CLI installed & logged in (az login)
# =============================================================================

set -e

# ─── VARIABLES ────────────────────────────────────────────────────────────────
RESOURCE_GROUP="portfolio-rg"
LOCATION="eastus"
VNET_NAME="portfolio-vnet"
SUBNET_NAME="portfolio-subnet"
NSG_NAME="portfolio-nsg"
VM_NAME="portfolio-vm"
VM_SIZE="Standard_B1s"
ADMIN_USERNAME="creeksonjoseph"
IMAGE="Ubuntu2204"
SSH_KEY_PATH="./static-_key.pem"

echo "============================================="
echo " Group 5 — Azure Portfolio Deployment"
echo " Provisioning infrastructure in: $LOCATION"
echo "============================================="

# ─── 1. RESOURCE GROUP ────────────────────────────────────────────────────────
echo "[1/6] Creating Resource Group..."
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output table

# ─── 2. VIRTUAL NETWORK ───────────────────────────────────────────────────────
echo "[2/6] Creating Virtual Network..."
az network vnet create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VNET_NAME" \
  --address-prefix "10.0.0.0/16" \
  --subnet-name "$SUBNET_NAME" \
  --subnet-prefix "10.0.1.0/24" \
  --output table

# ─── 3. NETWORK SECURITY GROUP ────────────────────────────────────────────────
echo "[3/6] Creating Network Security Group..."
az network nsg create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$NSG_NAME" \
  --output table

# ─── 4. NSG RULES (Inbound) ───────────────────────────────────────────────────
echo "[4/6] Configuring NSG inbound rules..."

# Allow SSH (port 22)
az network nsg rule create \
  --resource-group "$RESOURCE_GROUP" \
  --nsg-name "$NSG_NAME" \
  --name "Allow-SSH" \
  --protocol Tcp \
  --direction Inbound \
  --priority 1000 \
  --source-address-prefix "*" \
  --source-port-range "*" \
  --destination-address-prefix "*" \
  --destination-port-range 22 \
  --access Allow \
  --output table

# Allow HTTP (port 80)
az network nsg rule create \
  --resource-group "$RESOURCE_GROUP" \
  --nsg-name "$NSG_NAME" \
  --name "Allow-HTTP" \
  --protocol Tcp \
  --direction Inbound \
  --priority 1010 \
  --source-address-prefix "*" \
  --source-port-range "*" \
  --destination-address-prefix "*" \
  --destination-port-range 80 \
  --access Allow \
  --output table

# Allow HTTPS (port 443) — for future use
az network nsg rule create \
  --resource-group "$RESOURCE_GROUP" \
  --nsg-name "$NSG_NAME" \
  --name "Allow-HTTPS" \
  --protocol Tcp \
  --direction Inbound \
  --priority 1020 \
  --source-address-prefix "*" \
  --source-port-range "*" \
  --destination-address-prefix "*" \
  --destination-port-range 443 \
  --access Allow \
  --output table

# ─── 5. ASSOCIATE NSG WITH SUBNET ─────────────────────────────────────────────
echo "[5/6] Associating NSG with Subnet..."
az network vnet subnet update \
  --resource-group "$RESOURCE_GROUP" \
  --vnet-name "$VNET_NAME" \
  --name "$SUBNET_NAME" \
  --network-security-group "$NSG_NAME" \
  --output table

# ─── 6. DEPLOY VM ─────────────────────────────────────────────────────────────
echo "[6/6] Deploying Linux VM..."
az vm create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VM_NAME" \
  --image "$IMAGE" \
  --size "$VM_SIZE" \
  --admin-username "$ADMIN_USERNAME" \
  --ssh-key-values "$(cat ${SSH_KEY_PATH}.pub 2>/dev/null || echo '')" \
  --vnet-name "$VNET_NAME" \
  --subnet "$SUBNET_NAME" \
  --nsg "$NSG_NAME" \
  --public-ip-sku Standard \
  --output table

# ─── OPEN PORTS ───────────────────────────────────────────────────────────────
echo "Opening ports 80 and 443 on VM..."
az vm open-port \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VM_NAME" \
  --port 80 \
  --priority 900

az vm open-port \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VM_NAME" \
  --port 443 \
  --priority 901

echo ""
echo "============================================="
echo " Infrastructure provisioned successfully!"
echo " VM Public IP:"
az vm list-ip-addresses \
  --resource-group "$RESOURCE_GROUP" \
  --name "$VM_NAME" \
  --query "[].virtualMachine.network.publicIpAddresses[0].ipAddress" \
  --output tsv
echo "============================================="
