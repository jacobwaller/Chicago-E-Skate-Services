import React from "react";
import { Divider, Layout, PageHeader, Modal, Carousel, Col } from "antd";
import { RocketOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import classes from "./app.module.css";
import { Ride } from "../ride";
import Avatar from "antd/lib/avatar/avatar";
import RideData from "../../interfaces/RideData";
import { Information } from "../information";

const { Content, Footer } = Layout;

function GroupRideContent() {
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
      <div
        onClick={() =>
          Modal.info({
            okText: "Dismiss",
            icon: <RocketOutlined />,
            title: ride.title,
            cancelButtonProps: {},
            content: (
              <>
                <p>
                  There is a ride on {ride.date}. We will be meeting at
                  {" " + ride.meetTime} and launching at {" " + ride.launchTime}
                  .
                </p>
                <p>
                  We'll be starting at {ride.startPoint} and going to{" "}
                  {ride.endPoint}. A link to the route can be found{" "}
                  <a href={ride.routeLink}>here</a>. The route is{" "}
                  {ride.routeDistance} miles long.{" "}
                </p>
                <p>{ride.description}</p>
                <p>
                  The ride will be conducted on {ride.type} conditions, so make
                  sure your vehicle can handle that terrain. Arrive to the start
                  point with enough charge to follow the route. DON'T FORGET
                  YOUR HELMET!
                </p>
              </>
            ),
          })
        }
      >
        <Col span={24}>
          <Ride key={i} loading={false} rideData={ride} />
        </Col>
      </div>
    ));
  } else {
    cardInfo = (
      <Col span={24}>
        <Ride key={0} loading={true} rideData={undefined} />
      </Col>
    );
  }

  return (
    <Carousel autoplay={false} dots={true} easing="linear">
      {cardInfo}
    </Carousel>
  );
}

export class App extends React.Component {
  render() {
    return (
      <Layout className={classes.fullPage}>
        <PageHeader
          title="Chicago E-Skate"
          className={classes.header}
          avatar={{ src: "./logo.jpg" }}
        ></PageHeader>

        <Content className={classes.siteContent}>
          <GroupRideContent />
          <Divider />
          <Information />
        </Content>
        <Footer className={classes.footer}>
          <p>Join us on Telegram</p>
          <Avatar src="./telegram.png"></Avatar>
        </Footer>
      </Layout>
    );
  }
}
