import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const HomepageEditor = () => {
  console.log("HomepageEditor is rendering!");
  
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">Homepage Editor Test</h2>
      <p>If you can see this, the component is rendering correctly.</p>
      <Button onClick={() => toast.success("Button works!")}>
        Test Button
      </Button>
    </div>
  );
};
