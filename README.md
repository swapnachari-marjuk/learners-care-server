## **Learners Care - API Documentation**

### **1. Base URL**
`http://localhost:5000`

---

### **2. User Authentication**

#### **Register User**
* **URL:** `/api/users`
* **Method:** `POST`
* **What it does:** Saves a new user to the database with a hashed password.
* **Body (JSON):**
    ```json
    {
      "name": "Your Name",
      "email": "user@example.com",
      "password": "yourpassword",
      "role": "student"
    }
    ```

#### **Login User**
* **URL:** `/api/users/login`
* **Method:** `POST`
* **What it does:** Checks email and password. If correct, it gives you a **Token**.
* **Response:** Returns `success: true`, `token`, and `user` info (without password).

---

### **3. Course Management**

#### **Get All Courses**
* **URL:** `/api/courses`
* **Method:** `GET`
* **Query:** `/api/courses?search=javascript` (optional)
* **What it does:** Shows all available courses.

#### **Get Single Course**
* **URL:** `/api/courses/:id`
* **Method:** `GET`
* **What it does:** Shows details of one specific course using its ID.

#### **Admin Actions (Update/Delete)**
* **URLs:** `/api/courses/:id`
* **Methods:** `PATCH` (to edit) or `DELETE` (to remove).

---

### **4. Enrollment (Secure Routes)**
> **Important:** You must send the token in the Header:  
> `Authorization: Bearer <your_token>`

#### **Enroll in Course**
* **URL:** `/api/enroll`
* **Method:** `POST`
* **What it does:** Joins a user to a course. It also checks if you already enrolled before.

#### **My Enrolled Courses**
* **URL:** `/api/enroll/:email`
* **Method:** `GET`
* **What it does:** Shows all courses bought by this specific user.

#### **Check Enrollment Status**
* **URL:** `/api/enroll?email=...&courseId=...`
* **Method:** `GET`
* **What it does:** Tells the frontend if a user has already paid for a specific course.

---

### **5. Common Status Codes**
* **200/201:** Success!
* **401:** No token found (Unauthorized).
* **403:** Token is wrong or expired (Forbidden).
* **500:** Server side error.

*Connect with Developer*
[Linkedin](https://www.linkedin.com/in/ahmad-marjuk/)
<br>

[Portfolio](https://marjuks-portfolio.vercel.app/)

<br>

[E-Mail](marjukmujaddedi@gmail.com)

