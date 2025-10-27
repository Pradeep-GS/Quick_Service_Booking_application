import { useState } from 'react'
import login_img from'../assets/service_login.png'
import { FaEye,FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
const ServiceLogin = () => {
    const[view,setview]=useState(true)
    const[email,setemail]=useState("")
    const[pass,setpass]=useState("")

   const navigate=useNavigate();

    const login=async(e)=>
    {
        e.preventDefault()

        try{
            const response = await axios.post("http://localhost:8080/service/login",{
                email:email,
                password:pass,
            });
            const res = response.data;

            if(res.success)
            {
                navigate("/user/dashboard");
                alert(res.message)
            }
            else{
                alert(res.message)
                navigate("/service/sigin");
            }
        }
        catch(e)
        {
            console.log(e);
        }
    }
  return (
    <div className="container sm:p-10 lg:w-[60%] h-[70vh] mx-auto lg:grid lg:grid-cols-2 mt-[5%]">
        <div className="form border-[1px]  flex flex-col justify-center">
            <h1 className="text-center text-5xl text-[var(--primary--color)] my-10 ">LOG IN</h1>
            <div className="form w-[80%] mx-auto">
                <form onSubmit={login} className="mx-auto"> 
                    <div className="mail border-[1px] w-full h-10">
                        <input type="text" id="email" placeholder="Enter Your Email / UserName"className="w-full h-10 p-1 outline-none" onChange={(e)=>setemail(e.target.value)}/>
                    </div>
                    <div className="pass border-[1px] w-full mt-10 h-10 flex">
                        <input type={view?"password":"text"} id="password" placeholder="Enter Your Password" name="pass" className="w-[100%] h-10 p-1 outline-none"  onChange={(e)=>setpass(e.target.value)} />
                        <div type="button" className=" mr-1 text-2xl mt-2 cursor-pointer text-center" onClick={()=>setview(!view)}>
                            {view?<FaEye />:<FaEyeSlash/>}
                        </div>
                    </div>
                    <button type="submit" className="mt-10 w-[80%] border-[1px] mx-9 bg-[var(--primary--color)] px-2 py-2 text-white cursor-pointer" >Log In</button>
                </form>
                <p className='mt-10 text-center'>If Not Registed ?  <Link to={'/service/sigin'} className='text-blue-500'>Sign In</Link></p>
            </div>
        </div>
        <div className="image bg-[var(--primary--color)] hidden lg:flex justify-center items-center text-white">
            <img src={login_img} alt="" />
        </div>
    </div>
  )
}

export default ServiceLogin