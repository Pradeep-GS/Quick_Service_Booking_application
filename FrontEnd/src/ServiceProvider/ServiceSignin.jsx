import { useState } from 'react'
import login_img from'../assets/service_login.png'
import { FaEye,FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

const ServiceSignin = () => {
    const[view,setview]=useState(true)
    const [isValid, setIsValid] = useState(null);
    const[form,setform]=useState({
        name:'',
        email:'',
        pass:'',
        phone:''
    })
    const navigate = useNavigate()

    const ErrorMessage=(password)=>{
        if(password.length<8)
            return "The Password Length Is Less Than 8";
        if(!/[A-Z]/.test(password))
            return "The Password Must Contain AtLeast 1 UpperCase";
        if(!/\d/.test(password))
            return "The Password Must Contain AtLeast 1 Numeric Number";
        if(!/[!@#$%^&*_-]/.test(password))
            return "The Password Must Contain AtLeast 1 Special Character";
        return null
    }
    const verify = (pass)=>
    {
        const reg = /^(?=.[A_Z]) (?=.*\d)(?=.[!@#$%^&*_-]).{8,}$/;
        return reg.test(pass)
    }
    const change = (e)=>{
        const {name,value}=e.target;
        setform({...form,[name]:value})
        if (name === "pass") {
        setIsValid(verify(value));
        }
    }
    const display = async (e) => {
        e.preventDefault();
        const error = ErrorMessage(form.pass)
        if(error!=null)
        {
            alert(error);
            return;
        }
        try{
            const response = await axios.post("http://localhost:8080/service/check",{
                email:form.email,
                mobileNumber:form.phone
            });
            const res = response.data;

            if(res.success)
            {
                alert(res.message)
            }
            else{
                navigate("/service/profilesetup",{state:{
                            name:form.name,
                            email:form.email,
                            password:form.pass,
                            phone:form.phone
                        }})
            }
        }
        catch(e){
            console.log(e)
        }
    };
  return (
     <div className="container sm:p-10 lg:w-[60%] h-[70vh] mx-auto lg:grid lg:grid-cols-2 mt-[5%]">
            <div className="form border-[1px]  flex flex-col justify-center">
                <h1 className="text-center text-5xl text-[var(--primary--color)] my-10 ">SIGN IN</h1>
                <div className="form w-[80%] mx-auto">
                    <form onSubmit={display} className="mx-auto"> 
                        <div className="name border-[1px] w-full h-10">
                            <input type="text" id="name" placeholder="Enter Your Name" name="name" className="w-full h-10 p-1 outline-none" onChange={change} />
                        </div>
                        <div className="mail border-[1px] mt-10 w-full h-10">
                            <input type="email" id="email" placeholder="Enter Your Email"className="w-full h-10 p-1 outline-none" name="email" onChange={change}/>
                        </div>
                         <div className="pass w-full h-10 flex items-center border mt-10 r px-2">
                            <input type={view?"password":"text"} id="password" placeholder="Enter Your Password" name="pass" className="w-[100%] h-10 p-1 outline-none"  onChange={change} />
                            <div type="button" className=" mr-1 text-2xl mt-2 cursor-pointer text-center" onClick={()=>setview(!view)}>{view?<FaEye />:<FaEyeSlash/>}</div>
                            
                        </div>
                        <div className="phone border-[1px] mt-10 w-full h-10">
                            <input type="text" id="phone" placeholder="Enter Your Mobile Number"className="w-full h-10 p-1 outline-none" name="phone" onChange={change}/>
                        </div>
                        <button type="submit" className="mt-10 w-[80%] border-[1px] mx-9 bg-[var(--primary--color)] px-2 py-2 text-white">Sign In</button>
                    </form>
                    <p className='mt-10 text-center'>If Already Registed ?  <Link to={'/service/login'} className='text-blue-500'>Log In</Link></p>
                </div>
            </div>


            <div className="image bg-[var(--primary--color)] hidden lg:flex justify-center items-center text-white ">
                <img src={login_img} alt="" />
            </div>
        </div>
  )
}

export default ServiceSignin