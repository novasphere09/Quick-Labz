import { useState, useCallback } from 'react';

export function usePincodeLookup() {
  const [isLookingUp, setIsLookingUp] = useState(false);

  const lookupPincode = useCallback(async (pincode: string) => {
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      return null;
    }

    setIsLookingUp(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0];
        return {
          city: postOffice.District || postOffice.Block,
          state: postOffice.State,
          area: postOffice.Name
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch pincode details:", error);
      return null;
    } finally {
      setIsLookingUp(false);
    }
  }, []);

  return { lookupPincode, isLookingUp };
}
