import classes from './Login.module.scss';
import Input from '../Common/Input/Input';
import Image from 'next/image';
import profilePic from '../../../public/istockphoto-518654434-612x612.jpg';
import Link from 'next/link';
import {SubmitHandler, useForm} from "react-hook-form";
import UserForm from "../../types/UserForm";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';
import { incrementByAmount } from "../../features/auth/authSlice";
import {useEffect} from "react";

const LoginForm = () => {
    const count = useSelector((state: any) => state.auth.count);
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
    const dispatch = useDispatch()
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        // loads from clients local storage
        const auth = typeof window !== 'undefined' ? localStorage.lolo : null;
        if (auth !== undefined) {
            // updates the store with local storage data
            dispatch(incrementByAmount({amount: 34, isLoggedIn: true}));
        }
    }, []);

    const onSubmit : SubmitHandler<UserForm> = (data) => {
        fetch('https://localhost:9008', {
            method: 'POST',
            body: JSON.stringify({ data }),
        })
            .then((res ) => console.log('lolo'))
            .catch((error) => {
                console.log(error);
                console.log(count);
                dispatch(incrementByAmount({amount: 34, isLoggedIn: true}))

                setTimeout(() => {
                    if (isLoggedIn) {
                        router.push('lti-config')
                    }
                }, 1000);

                //router.push('lti-config');
            })
    }

    return (
        <div className={classes.login_section}>
            <Image className={classes.profile_picture} src={profilePic} alt="profile" width={200} height={200} />
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                {'count: ' + count}
                <div>{`El usuario inició sesión: ${isLoggedIn}`}</div>
                <Input>
                    <input
                        {...register("email", { required: true })}
                        className={errors.email ? classes['invalid'] : undefined}
                        id="email"
                        type="email"
                        placeholder="Enter email"
                    />
                </Input>
                <Input>
                    <input
                        {...register("password", { required: true })}
                        className={errors.password ? classes['invalid'] : undefined}
                        id="password"
                        type="text"
                        placeholder="Enter password"
                    />
                </Input>

                <input type="submit" value="Login" />
                <button>
                    <Link href={'/register'}>Sign Up</Link>
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
