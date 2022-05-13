import * as React from 'react';
import { Layout } from 'react-admin';
import ReactAdminHeader from '../../components/ReactAdminHeader';

const ReactAdminHeaderLayout = (props) => (
  <Layout {...props}
    sx={{
      "& .RaLayout-appFrame": {
          marginTop: "0px",
      },
    }}
    appBar={() => <ReactAdminHeader avatar={props.avatar}/>} />
)

export default ReactAdminHeaderLayout;