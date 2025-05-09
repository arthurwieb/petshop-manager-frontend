"use client";
import { useEffect } from "react";
import { BaseService } from "@/services/BaseService";

export default function Logout() {
  useEffect(() => {
    new BaseService("").logout(); 
  }, []);

  return <h2>Logged out</h2>;
}