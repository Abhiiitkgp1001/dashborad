import React, {useEffect} from 'react'
import { Button, message, Space } from 'antd';
import { useSelector } from 'react-redux';
const ToastContaier = (props) => {
    const alert = useSelector((state) => state.alert);
    const [messageApi, contextHolder] = message.useMessage();
    
    useEffect(() => {
       if(alert){
        messageApi.open({
            type: alert.type,
            content: alert.message,
            duration: 1
          });
       }
    }, [alert])
    
  return (
    <div>
{contextHolder}
        {props.children}
    </div>
  )
}

export default ToastContaier