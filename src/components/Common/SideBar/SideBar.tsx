import classes from './SideBar.module.scss';

const SideBar = (props: any) => {
  return (
    <div className={classes.main_sidebar}>
      {props.children.filter(child => child != null).map((child: any, index: number) => {
        return (
          <div key={index} className={classes.child}>
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default SideBar;
