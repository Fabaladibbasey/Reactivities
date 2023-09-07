import ReactDOM from "react-dom/client";
import "./app/index.css";
import "semantic-ui-css/semantic.min.css";
import "react-calendar/dist/Calendar.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { store, StoreContext } from "./app/api/stores/store";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <StoreContext.Provider value={store}>
      <RouterProvider router={router} />
    </StoreContext.Provider>
  </>
);
