import React from "react";
import RideData from "../../interfaces/RideData";
import { Card, Col, Skeleton, Avatar, Carousel, Divider } from "antd";
import { useQuery, QueryCache, ReactQueryCacheProvider } from "react-query";

const queryCache = new QueryCache();

interface RideProps {
  loading: boolean;
  rideData: RideData | undefined;
}

export class Ride extends React.Component<RideProps> {
  render() {
    return (
      <>
        <Card
          hoverable
          bordered={false}
          bodyStyle={{
            backgroundColor: "rgb(231,231,231)",
            border: 0,
            borderRadius: 10,
          }}
        >
          <Skeleton loading={this.props.loading} active>
            <Card.Meta
              avatar={<Avatar shape="square" alt="image" src="/maps.jpg" />}
              title={`${this.props.rideData?.title}`}
            />
            <Divider />
            <p>
              {" "}
              {`(${this.props.rideData?.date} @ ${this.props.rideData?.meetTime})`}
            </p>
            <p>{this.props.rideData?.description}</p>
            <p>
              {this.props.rideData?.startPoint} to{" "}
              {this.props.rideData?.endPoint}
            </p>
          </Skeleton>
        </Card>
      </>
    );
  }
}
