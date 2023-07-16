# Blog

Welcome to the "Blog" repository! This project is a comprehensive blog application that enables users to publish and manage posts, write and like comments, and undergo a secure authentication process (SignIn and SignUp).

> The primary objective of developing this project is to showcase some skills to potential clients and provide an **example of my work**.

## Summary

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [UI/UX](#uiux)
4. [Deployment](#deployment)
5. [Getting Started](#getting-started)
6. [Contributions](#contributions)
7. [License](#license)

## <a name="features"></a>Features

The project's main features are :

- Sign up or sign in to gain access to the blog and its features.
- Create, edit, customize or delete posts, allowing you to share your thoughts and engage with the community.
- Interact with posts by writing comments and expressing appreciation through likes.
- Experience real-time updates as new comments or likes are made by other users, ensuring a dynamic and engaging environment.
- Utilize the text editing capabilities provided by Slate, enabling you to craft rich and captivating content.
- Navigate through the various pages and sections of the blog effortlessly.
- Utilize the search feature to find specific posts based on keywords or topics of interest.

## <a name="technologies-used"></a>Technologies Used

The **frontend** of the blog is built using the following technologies:

- **Vite**: A build tool that aims to provide a faster and leaner development experience for modern web projects.
- **React**: A powerful JavaScript library for building user interfaces. It serves as the foundation for creating an interactive and responsive frontend for the blog.
- **GraphQL**: A sophisticated query language and runtime for APIs. In this project, GraphQL is integrated with Apollo Client to ensure efficient data fetching and manipulation.
- **Real-Time**: The blog includes real-time functionality, implemented using subscriptions. This feature allows users to receive instantaneous updates without requiring manual page refreshes.
- **TailwindCSS**: A utility-first CSS framework that adheres to a Mobile-First approach. Leveraging TailwindCSS allows for writing code inline, resulting in a fully responsive website design that is adaptable to different devices and screen sizes.
- **Slate**: A highly customizable rich text editing framework integrated into the blog's text editing functionality. It provides a seamless and intuitive writing experience for users.
- **Testing**: A suite of tests has been meticulously crafted to ensure the proper loading of all pages and validate the authentication process, ensuring a robust and reliable frontend for the blog.

The **backend** of the blog is powered by the following technologies:

- **Express JS (Node JS)**: An efficient and scalable web application framework utilized for developing the robust backend server that powers the blog.
- **GraphQL**: A sophisticated query language and runtime for APIs. In this project, GraphQL is integrated with Apollo Server to handle data fetching and manipulation efficiently.
- **MongoDB**: A versatile NoSQL database chosen to store and manage the blog's data. MongoDB offers flexibility and scalability, making it an ideal choice for this project.

## <a name="uiux"></a>UI/UX

The design is quite rudimentary, it's clear that it could have been better thought out and worked on ;).

## <a name="deployment"></a>Deployment

This project involves a small CI/CD pipeline, including the following steps:

- Test whether frontend pages load correctly
- Deploy code to the Virtual Host

You can access the project here: http://www.blog.hamzacode.com/

## <a name="getting-started"></a>Getting Started

To start using the blog project, follow these explicit steps:

1. Clone this repository to your local machine using the following command:

   `git clone https://github.com/HamzaLinge/Blog.git`

2. Install the necessary dependencies:

   `cd Blog/frontend |
yarn install |
cd ../backend |
yarn install`

3. Set up the environment variables : _See "backend/.env.example" file_

4. Start the backend server by running the following command:

   `yarn dev`

5. Finally, launch the frontend application by running the following command:

   `yarn dev`

6. Access the blog in your web browser by navigating to http://localhost:5173 and explore the various features and functionalities it offers.

## <a name="contributions"></a>Contributions

As this project is only an example, there are still bugs and imperfections., so contributions to this project are highly valued and appreciated. If you wish to contribute, please follow the standard pull request workflow, ensuring adherence to best practices and providing clear commit messages.

## <a name="license"></a>License

The code in this repository is licensed under the MIT License.

Feel free to explore the blog project, review the code, and utilize it as a reference for your own work. If you have any questions or feedback, please don't hesitate to reach out. Enjoy using the Blog!
