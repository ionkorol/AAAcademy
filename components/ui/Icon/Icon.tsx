import { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import React from "react";

import styles from "./Icon.module.scss";

interface Props {
  size: SizeProp;
  icon: IconProp;
  bgColor?: "primary" | "secondary" | "tertiary" | "quaternary";
}

const Icon: React.FC<Props> = (props) => {
  const { size, icon, bgColor } = props;
  const colorDict = {
    primary: styles.primary,
    secondary: styles.secondary,
    tertiary: styles.tertiary,
    quaternary: styles.quaternary,
  };

  return (
    <div className={`${styles.container} ${colorDict[bgColor]}`}>
      <FontAwesomeIcon size={size} icon={icon} fixedWidth />
    </div>
  );
};

export default Icon;
