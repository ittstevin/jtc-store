'use client';

import { useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from 'next-auth/react'
import { useRouter } from "next/navigation";

const RegisterForm = () => {

    const [ isLoading , setIsLoading ] = useState(false)
    const { register, handleSubmit, formState: {errors}} = useForm<FieldValues>({
        defaultValues:{
            name: '',
            email: '',
            password: ''
        }
    })

    const router = useRouter()

    const onsubmit:SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('/api/register', data).then(() => {
            toast.success('Account created')

            signIn('credentials',{
                email: data.email,
                password: data.password,
                redirect: false,
            }).then((callback) => {
                if(callback?.ok){
                    router.push('/cart')
                    router.refresh()
                    toast.success('Logged In Successfully')
                }

                if(callback?.error){
                    toast.error(callback.error)
                }
            })
        }).catch(() => toast.error("Something went wrong")).finally(() =>{
            setIsLoading(false);
        }
        );
    }

    return ( 
        <>
        <Heading title="Sign up"/>
        <Button 
        outline
        label="Sign up with Google"
        icon={AiOutlineGoogle}
        onClick={() => {}}
        />
            <hr className="bg-slate-300 w-full h-px"/>
                <Input
                id="name"
                label="Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
                <Input
                id="email"
                label="email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
                <Input
                id="password"
                label="password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
                type="password"
            />
            <Button label={isLoading ? "Loading..." : 'Sign up'} onClick={handleSubmit(onsubmit)} />
            <p className="text-sm">Already Have an Account? <Link className="underline" href='/login'>Login</Link></p>
        </>
     );
}
 
export default RegisterForm;