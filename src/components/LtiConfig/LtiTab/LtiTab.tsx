const LtiTab = (props: any) => {
  return (
    <>
      {props.fields.map((field: any) => {
        const isReadOnly = field.isReadOnly;
        return (
          <div key={field.inputName}>
            <label>{field.inputName}</label>
            <br />
            <input
              defaultValue={field.value}
              {...props.register(field.inputName, {
                required: true,
                disabled: isReadOnly,
              })}
            />
          </div>
        );
      })}
    </>
  );
};

export default LtiTab;
