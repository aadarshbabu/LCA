
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import VideoSubmissionForm from "@/components/VideoSubmissionForm";

const SubmitVideo = () => {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Submit a Video</CardTitle>
          <CardDescription>
            Fill out the form below to submit your video for review.
            Our admin team will review your submission and approve it if it meets our guidelines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VideoSubmissionForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmitVideo;
