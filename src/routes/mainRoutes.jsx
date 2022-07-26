import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { Home, NotFound } from "../screens";

const MainRoutes = () => {
  return (
    <BrowserRouter basename="/guess-the-country">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;
