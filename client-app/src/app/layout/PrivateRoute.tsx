import React from 'react';
import { observer } from "mobx-react-lite";
import { RouteProps, Route, Redirect } from "react-router-dom";
import { useStore } from "../api/stores/store";

interface Props extends RouteProps {
    component: React.ComponentType<any>;
}

export default observer(function PrivateRoute({ component: Component, ...rest }: Props) {
    const { userStore } = useStore();
    return (
        <Route
            {...rest}
            render={(props) => userStore.isLoggedIn ? <Component {...props} /> : <Redirect to={'/'} />}
        />
    )
})