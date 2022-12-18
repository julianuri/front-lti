import classes from "./SideBar.module.css";

const SideBar = (props: any) => {
  return (
    <div className={classes["main-sidebar"]}>
      {props.children.map((child: any, index: number) => {
        return (
          <div key={index} className={classes.child}>
            {child}
          </div>
        );
      })}
    </div>
  );
};

//<div className={classes["main-sidebar"]}>SIDEBAR RELLENO</div>

export default SideBar;
