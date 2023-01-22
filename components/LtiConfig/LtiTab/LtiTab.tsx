const LtiTab = (props: any) => {
  return (
    <>
      {props.fields.map((field: any) => (
        <input readOnly key={field.value} value={field.value} {...props.register(field.inputName, { required: true })} />
      ))}
    </>
  );
};

export default LtiTab;
