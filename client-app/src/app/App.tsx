import { useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./layout/NavBar";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useStore } from "./api/stores/store";
import LoadingComponent from "./layout/LoadingComponent";
import ModalContainer from "./common/modal/ModalContainer";
import HomePage from "../features/home/HomePage";
import ScrollToTop from "./layout/ScrollToTop";

function App() {
  const { userStore, commonStore } = useStore();
  const location = useLocation();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      userStore
        .getFacebookLoginStatus()
        .finally(() => commonStore.setAppLoaded());
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent content="Loading app..." />;
  return (
    <>
      <ScrollToTop />
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer />
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <NavBar />
          <Container style={{ marginTop: "6rem" }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}

export default observer(App);
