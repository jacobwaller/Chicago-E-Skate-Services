import React from "react";
import { Card, Col, Row, Skeleton } from "antd";
import classes from "./group-rides.module.css";

// TODO not sure what this will actually be, just basing it off the mock
interface RideData {
  title: string;
  date: Date;
  time: string;
  city: string;
  startPoint: string;
  endPoint: string;
  type: string;
  routeLink: string;
  description: string;
}

const randomRideDataTest: RideData[] = [];
for (let i = 0; i < 30; i++) {
  randomRideDataTest.push({
    title: `Tuesday Night Group Ride #${i}`,
    date: new Date(),
    startPoint: "McCormick Waterfall 123 N Main",
    endPoint: "Alive one 321 S 69th Street",
    description: "There's metered parking for...",
    city: "Chicago",
    routeLink: "",
    time: "3:00 PM",
    type: "STREET",
  });
}

const Ride: React.FC<{ rideData: RideData }> = ({ rideData }) => {
  const {
    title,
    date,
    startPoint: startLocation,
    endPoint: endLocation,
    description,
  } = rideData;
  // TODO make these pretty and cool, images
  return (
    <Card style={{ width: 300, marginTop: 16 }}>
      <Skeleton loading={false} active>
        <Card.Meta title={title} description={description} />
      </Skeleton>
    </Card>
  );
};

export const GroupRides: React.FC = () => {
  // TODO add react-virtualized to do infinite scrolling
  return (
    <Row
      className={classes.rides}
      gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
      justify="space-around"
    >
      {randomRideDataTest.map((rideData, i) => (
        <Col>
          <Ride key={i} rideData={rideData} />
        </Col>
      ))}
    </Row>
  );
};
