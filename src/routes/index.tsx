import { RouteObject } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { SignInPage } from "../pages/SignInPage";
import { IndexPage } from "../pages/IndexPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "index",
        element: <IndexPage />,
      },
    ],
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
];
