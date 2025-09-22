import { Button } from '@/components/ui/button'
import { FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const page = () => {
  return (
    <div className='flex items-center justify-center mt-5'>
      <Button>Chirantan</Button>
      <FormItem><Input /></FormItem>
    </div>
  )
}

export default page
