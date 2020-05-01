import * as React from "react";
import * as classNames from "classnames";
import styles from "./WallSwitch.module.scss";

const WallSwitch = ({ onClick, name, value }) => (
  <div className={classNames(styles.WallSwitch, value > 0 ? styles.On : styles.Off)} onClick={onClick}>
    <div className={styles.Name}>{name}</div>
    <div
      className={styles.Status}
    />
  </div>
);

export default WallSwitch;
