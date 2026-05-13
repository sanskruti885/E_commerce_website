C:\Users\Administrator>cd Downloads

C:\Users\Administrator\Downloads>ssh -i VM1_key.pem azureuser@20.255.56.127

sudo apt update && sudo apt upgrade -y

azureuser@VM1:~$ curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

azureuser@VM1:~$ sudo apt install -y nodejs

azureuser@VM1:~$ node -v

azureuser@VM1:~$ sudo apt install git nginx -y

azureuser@VM1:~$ cd ~
azureuser@VM1:~$ git clone https://github.com/sanskruti885/E_commerce_website

azureuser@VM1:~$ cd E_commerce_website

azureuser@VM1:~/E_commerce_website$ ls


azureuser@VM1:~/E_commerce_website$ cd backend

azureuser@VM1:~/E_commerce_website/backend$ npm install

azureuser@VM1:~/E_commerce_website/backend$ nano .env
PORT=5001
MONGO_URI=mongodb+srv://sanskruti:san885patil@cluster0.xzhqa.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=mysecret


azureuser@VM1:~/E_commerce_website/backend$ sudo npm install -g pm2

azureuser@VM1:~/E_commerce_website/backend$ pm2 start server.js --name backend

azureuser@VM1:~/E_commerce_website/backend$ pm2 list 

curl http://localhost:5001/api/products

cd ../frontend

npm install

npm run build

sudo nano /etc/nginx/sites-available/app

sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/

sudo rm /etc/nginx/sites-enabled/default

sudo nginx -t

output::: nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

sudo systemctl restart nginx

sudo chmod 755 /home/azureuser
sudo chmod -R 755 /home/azureuser/E_commerce_website

sudo systemctl restart nginx

sudo nano /etc/nginx/sites-available/app

server {
    listen 80;
    server_name 20.255.56.127;

    root /home/azureuser/E_commerce_website/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

sudo nginx -t

sudo systemctl restart nginx

