
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trophy, Users, Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }).max(50),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }).max(200),
  type: z.enum(['solo', 'group', 'global']),
  goal: z.coerce.number().min(1).max(100),
  durationDays: z.coerce.number().min(1).max(30),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateChallengeProps {
  onCreateChallenge: (challenge: any) => void;
}

const CreateChallengeDialog = ({ onCreateChallenge }: CreateChallengeProps) => {
  const [open, setOpen] = React.useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'solo',
      goal: 5,
      durationDays: 7,
    },
  });

  const onSubmit = (data: FormValues) => {
    // Create a new challenge with the form data
    const newChallenge = {
      id: `challenge-${Date.now()}`,
      title: data.title,
      description: data.description,
      type: data.type,
      goal: data.goal,
      timeLeft: `${data.durationDays} days left`,
      reward: data.type === 'solo' ? 30 : data.type === 'group' ? 50 : 100,
      userProgress: 0,
      participants: data.type !== 'solo' ? [] : undefined,
    };

    onCreateChallenge(newChallenge);
    toast.success('Challenge created!', {
      description: 'Your new challenge has been created successfully.',
    });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Create Challenge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Challenge</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenge Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Weekend Focus" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Complete focus time over the weekend" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenge Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select challenge type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solo">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            <span>Solo Challenge</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="group">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Group Challenge</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="global">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Global Challenge</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal (hours)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={100} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="durationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (days)</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input type="number" min={1} max={30} {...field} />
                    </FormControl>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" className="w-full sm:w-auto">Create Challenge</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChallengeDialog;
