import LoginForm from '../src/components/Login/Login';
import {useSelector} from "react-redux";

function HomePage() {

    const { isLoggedIn }  = useSelector((state) => state.auth);

    return (
        <>
            { (isLoggedIn) ?
                <div>{'Has logged In!'}</div> :
                <LoginForm />
            }
        </>
    );
}

export default HomePage;
