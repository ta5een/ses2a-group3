import React, { useContext } from "react";

import {
  Header,
  HeaderContainer,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  HeaderSideNavItems,
  SideNav,
  SideNavItems,
  SkipToContent,
} from "carbon-components-react";

import {
  Help20,
  Login20,
  Logout20,
  Person20,
  Settings20,
  UserFollow20,
} from "@carbon/icons-react";

import { AuthApi } from "api";
import { AuthContext } from "context";

type UIShellProps = {
  children?: JSX.Element;
};

const UIShell = ({ children }: UIShellProps) => {
  const authContext = useContext(AuthContext);

  type GlobalAction =
    | "Help"
    | "Login"
    | "Logout"
    | "Profile"
    | "Register"
    | "Settings";

  const handleOnGlobalActionClick = (action: GlobalAction) => {
    const redirectTo = (path: string) => (window.location.pathname = path);

    switch (action) {
      // case "Help":
      //   redirectTo("/help");
      //   break;
      case "Login":
        redirectTo("/login");
        break;
      case "Logout":
        AuthApi.signOut(() => redirectTo("/logout"));
        break;
      case "Profile":
        redirectTo(`/profile/${authContext.authentication.id}`);
        break;
      case "Register":
        redirectTo("/register");
        break;
      case "Settings":
        redirectTo("/settings");
        break;
      default:
        redirectTo("/");
        break;
    }
  };

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <>
          {/* Header */}
          <Header aria-label="Group Interest">
            <SkipToContent />
            <HeaderMenuButton
              aria-label="Open menu"
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
            <HeaderName href="/" prefix="Group">
              Interest
            </HeaderName>

            {/* Header Navigation Links */}
            <HeaderNavigation aria-label="Navigation">
              <HeaderMenuItem
                isCurrentPage={window.location.pathname === "/groups"}
                href="/groups">
                My Groups
              </HeaderMenuItem>
              <HeaderMenuItem
                isCurrentPage={window.location.pathname === "/settings"}
                href="/settings">
                Settings
              </HeaderMenuItem>
            </HeaderNavigation>

            {/* Header Actions */}
            <HeaderGlobalBar>
              {/* <HeaderGlobalAction
                aria-label="Help"
                onClick={_ => handleOnGlobalActionClick("Help")}>
                <Help20 />
              </HeaderGlobalAction> */}
              {authContext.authentication.isAuthenticated ? (
                <>
                  {/* <HeaderGlobalAction
                    aria-label="Settings"
                    onClick={_ => handleOnGlobalActionClick("Settings")}>
                    <Settings20 />
                  </HeaderGlobalAction> */}
                  <HeaderGlobalAction
                    aria-label="Profile"
                    onClick={_ => handleOnGlobalActionClick("Profile")}>
                    <Person20 />
                  </HeaderGlobalAction>
                  <HeaderGlobalAction
                    aria-label="Logout"
                    onClick={_ => handleOnGlobalActionClick("Logout")}>
                    <Logout20 />
                  </HeaderGlobalAction>
                </>
              ) : (
                <>
                  <HeaderGlobalAction
                    aria-label="Register"
                    onClick={_ => handleOnGlobalActionClick("Register")}>
                    <UserFollow20 />
                  </HeaderGlobalAction>
                  <HeaderGlobalAction
                    aria-label="Login"
                    onClick={_ => handleOnGlobalActionClick("Login")}>
                    <Login20 />
                  </HeaderGlobalAction>
                </>
              )}
            </HeaderGlobalBar>

            {/* Side Navigation */}
            <SideNav
              aria-label="Side navigation"
              expanded={isSideNavExpanded}
              isPersistent={false}>
              <SideNavItems>
                <HeaderSideNavItems>
                  <HeaderMenuItem
                    isCurrentPage={window.location.pathname === "/groups"}
                    href="/groups">
                    My Groups
                  </HeaderMenuItem>
                  <HeaderMenuItem
                    isCurrentPage={window.location.pathname === "/settings"}
                    href="/settings">
                    Settings
                  </HeaderMenuItem>
                </HeaderSideNavItems>
              </SideNavItems>
            </SideNav>
          </Header>

          {/* Content */}
          {children}
        </>
      )}
    />
  );
};

export default UIShell;
