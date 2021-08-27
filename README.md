# Employee-portal

All the API call in the portal are done using ajax so all the actions in the portal are carried out without reloading the page
and all the APIS can be used from tools such as Postman

Type of users :
    admin : can add users,approve reject leaves, add leave setting
    employee : can view dashboard and apply for leaves

Before applying for a leave please create a leave setting (confiiguration) using the admin login



Create  an initial user lor login using this api :
    URL : http://127.0.0.1:8000/users/user-action/
    Request body :{
        "action": "add",
        "user_name": "test_user",  # will be used for login
        "password": "1234",
        "full_name":"Test Users",
        "email": "testuser@gmail.com",
        "userId": "21",          
        "userRole": "admin",       # can be either admin or employee
        "phone_number": "1234543214"
    }

How to Run :

    Install Python 3 and pip 
    use the command : pip install -r requirements.txt
    configure the database setting in base.py file according to your database
    use the command : python manage.py migrate
    use the command : python manage.py runserver

