# Deployment Guide: MERN E-Commerce App on Azure Ubuntu VM

This guide provides step-by-step instructions to deploy the MERN stack e-commerce application on a single Azure Ubuntu Virtual Machine.

## Prerequisites
- An active Azure account.
- Basic knowledge of terminal/command prompt.

## 1. Create an Azure VM
1. Log in to the [Azure Portal](https://portal.azure.com).
2. Click **Create a resource** -> **Virtual Machine**.
3. Choose **Ubuntu Server 24.04 LTS** (or 22.04 LTS).
4. Set the Size to standard (e.g., `Standard_B1s` for free tier or testing).
5. Set authentication type to **SSH public key** or **Password** (Remember your credentials).
6. In **Inbound port rules**, allow **HTTP (80)**, **HTTPS (443)**, and **SSH (22)**.
7. Click **Review + create** and then **Create**.
8. Once deployed, note down the **Public IP Address** of the VM.

## 2. Connect to the VM
Open your terminal and SSH into the machine:
```bash
ssh username@<YOUR_VM_PUBLIC_IP>
```

## 3. Install Required Software
Run the following commands on the VM to install Node.js, NPM, PM2, and Nginx.

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager for Node.js)
sudo npm install -g pm2

# Install Nginx (Web server/Reverse Proxy)
sudo apt install -y nginx
```

## 4. Upload Code to the VM
You can use `git` or `scp` to get your code onto the VM. 
If using Git, push your code to GitHub first, then clone it:
```bash
git clone <YOUR_REPO_URL>
cd <YOUR_REPO_DIRECTORY>
```

*(Alternatively, use `scp -r` or an SFTP client to copy the `frontend` and `backend` folders directly into the VM).*

## 5. Setup and Run the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend with PM2:
   ```bash
   pm2 start server.js --name "ecommerce-backend"
   ```
4. Save the PM2 process so it restarts on system reboot:
   ```bash
   pm2 startup
   pm2 save
   ```

*Note: The backend is now running locally on port 5001.*

## 6. Build the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the React app for production:
   ```bash
   npm run build
   ```
This will create a `dist` folder inside `frontend`.

## 7. Configure Nginx Reverse Proxy
We will configure Nginx to serve the built React app (frontend) on port 80, and reverse proxy `/api` requests to the backend (port 5001).

1. Open the Nginx default config file:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
2. Replace the contents with the following:

   ```nginx
   server {
       listen 80 default_server;
       listen [::]:80 default_server;

       # Replace the path below with the absolute path to your frontend/dist folder
       root /home/username/your-repo-folder/frontend/dist;
       index index.html index.htm;

       server_name _;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api/ {
           proxy_pass http://localhost:5001/api/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
3. Test Nginx configuration to ensure no syntax errors:
   ```bash
   sudo nginx -t
   ```
4. Restart Nginx to apply changes:
   ```bash
   sudo systemctl restart nginx
   ```

## 8. Final Verification
- Open your browser and navigate to `http://<YOUR_VM_PUBLIC_IP>`.
- You should see the React frontend.
- Try registering/logging in to verify the backend and MongoDB connectivity.
- *Troubleshooting:* If APIs fail, ensure `backend/server.js` has the correct `MONGO_URI`.

> Note for Production: In your React components (like `Home.jsx`, `Login.jsx`), you are using `http://localhost:5001/api/...`. For this Nginx setup, you can either replace `http://localhost:5001/api/` with `/api/` in your Axios requests, OR configure the Axios base URL globally.
