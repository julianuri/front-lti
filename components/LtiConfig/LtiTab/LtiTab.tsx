import { Fragment, useState } from "react";
import classes from "./LtiConfig.module.css";
import Link from "next/link";
import { useForm } from "react-hook-form";

const LtiTab = (props: any) => {
  console.log(props.fields);

  return (
    <Fragment>
      {props.fields.map((x: any) => {
        return (
          <input readOnly value={x.value} {...props.register(x.inputName, { required: true })} />
        );
      })}
    </Fragment>
  );
};

export default LtiTab;

/*{register your input into the hook by invoking the "register" function }
<input readOnly value={fields.domain} {...register("domain", { required: true })} />
<input
  readOnly
  value={fields["OIDC Redirect URL"]}
  {...register("oidc", { required: true })}
/>
<input
  readOnly
  value={fields["OpenID Connect Initiation Url"]}
  {...register("openid", { required: true })}
/>
<input readOnly value={fields["JWK URL"]} {...register("jwk", { required: true })} />

{/* include validation with required or other standard HTML validation rules }
{/*<input {...register("lauch", { required: true })} disabled /> }
{/* errors will return when field validation fails  }
{/*errors.exampleRequired && <span>This field is required</span>}*/
