import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import ReceiveRequestsInfo from "./ReceiveRequestsInfo";

export default function ReceivedList({ tripData }) {
  const [receivedData, setReceivedData] = useState(null);

  const fetchRequestData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ALERT_REQUEST_URI}/trip/${tripData.tripId}`
      );

      const decodedData = response.data.alertList.map((item) => ({
        id: item.id,
        tripId: item.tripId,
        tripName: item.tripName,
        senderId: item.senderId,
        senderName: item.senderName,
        position: JSON.parse(decodeURIComponent(window.atob(item.position))),
        aspiration: item.aspiration,
        alertType: item.alertType,
        usageId: item.usageId,
        read: item.read,
      }));

      setReceivedData(decodedData);
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  
  const updateReceivedData = async () => {
    await fetchRequestData();
  };

  useEffect(() => {
    fetchRequestData();
  }, [tripData.tripId]);

  return (
    <Fragment>
      {receivedData &&
        receivedData.map((data, index) => (
          <ReceiveRequestsInfo key={index} data={data} trip={tripData} updateReceivedData={updateReceivedData} />
        ))}
    </Fragment>
  );
}
