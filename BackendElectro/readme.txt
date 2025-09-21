Workflow

Admin (superuser):

Creates staff via /api/accounts/register-staff/

Staff:

Logs in via /api/accounts/login/ (session cookie stored)

Can access CRUD endpoints for /api/products/

Admin:

Has all permissions (Django superuser).


# To create staff
localhost:8000/api/accounts/register-staff/

{
  "username": "admin3",
  "email": "aakash@gmail.com",
  "password": "admin3"
}


api for products
http://localhost:8000/api/products/       # POST create product api
http://localhost:8000/api/products/       # GET all product api
http://localhost:8000/api/products/1/      # GET particcular product detail api
http://localhost:8000/api/products/1/      # PUT particcular product detail api
