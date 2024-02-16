import { Fragment } from "react";
import { MarkerF } from "@react-google-maps/api";


const Markers = ({ markers }) => (
  <Fragment>
    {markers.map((marker, index) => (
      <MarkerF key={index} label={String(index + 1)} position={marker.position} />
    ))}
    </Fragment>
);

export default Markers;