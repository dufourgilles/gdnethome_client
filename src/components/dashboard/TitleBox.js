import React from "react";
import PropTypes from "prop-types";
import { Button, Card, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import SimpleBar from "simplebar-react"
import "./TitleBox.scss";

const TitleBox = ({ edit, title, content }) => {
  const handleContentEditor = () => {
    if (edit != null) {
      return edit();
    }
  };
  return (
    <Card
      title={title}
      extra={
        <Tooltip title="Edit List">
          <Button
            id="btnEditDataPointList"
            type="link"
            onClick={handleContentEditor}
          >
            <EditOutlined />
          </Button>
        </Tooltip>
      }
    >
      <SimpleBar autoHide={false} style={{maxHeight: 400}}>
      <div className="titlebox-content">
          {content != null ? content : ""}
      </div>
      </SimpleBar>
    </Card>
  );
};

TitleBox.propTypes = {
  title: PropTypes.string.isRequired,
  edit: PropTypes.func,
  content: PropTypes.array
};

export default TitleBox;
