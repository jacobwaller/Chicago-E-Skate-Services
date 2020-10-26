import RideData from "./RideData";

export default interface RideProps {
  rideData: RideData | undefined | void;
  loading: boolean;
}
