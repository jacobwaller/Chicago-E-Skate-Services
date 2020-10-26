import React from "react";
import RideData from "../../interfaces/RideData";
import { Card, Col, Skeleton, Avatar, Carousel, Divider } from "antd";
import { useQuery, QueryCache, ReactQueryCacheProvider } from "react-query";
import { PropertySafetyFilled } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";

const queryCache = new QueryCache();

const openModal = (ride: RideData | undefined) => {};

interface RideProps {
  loading: boolean;
  rideData: RideData | undefined;
  // openModal: () => {};
}

const Ride: React.FC<RideProps> = (props) => {
  return (
    <div
      onClick={() => {
        openModal(props.rideData);
      }}
    >
      <Card
        bordered={false}
        bodyStyle={{
          backgroundColor: "rgb(231,231,231)",
          border: 0,
          borderRadius: 10,
        }}
      >
        <Skeleton loading={props.loading} active>
          <Card.Meta
            avatar={<Avatar shape="square" alt="image" src="/maps.jpg" />}
            title={`${props.rideData?.title}`}
          />
          <Divider />
          <p> {`(${props.rideData?.date} @ ${props.rideData?.meetTime})`}</p>
          <p>{props.rideData?.description}</p>
          <p>
            {props.rideData?.startPoint} to {props.rideData?.endPoint}
          </p>
        </Skeleton>
      </Card>
    </div>
  );
};

function Content() {
  const { data } = useQuery("repoData", () =>
    fetch(
      "https://us-central1-chicagoeskatewebsite-293020.cloudfunctions.net/fetchRide"
    ).then((res) => res.json())
  );

  // If we don't have data, just display a loading card
  // otherwise, show the info
  let cardInfo;
  if (data) {
    cardInfo = data.map((ride: RideData, i: number) => (
      <Col span={24}>
        <Ride key={i} loading={false} rideData={ride} />
      </Col>
    ));
  } else {
    cardInfo = (
      <Col span={24}>
        <Ride key={0} loading={true} rideData={undefined} />
      </Col>
    );
  }

  return (
    <Carousel autoplay={false} dots={false} easing="linear">
      {cardInfo}
    </Carousel>
  );
}

export const GroupRides: React.FC = (props) => {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Content />
    </ReactQueryCacheProvider>
  );
};
