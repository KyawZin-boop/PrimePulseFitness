import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api";

const Classes = () => {
  const navigate = useNavigate();

  const { data: gymClasses } = api.classes.getPopularClasses.useQuery();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <section id="classes" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-heading mb-4">Expert-Led Classes</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our diverse range of fitness classes led by certified trainers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {gymClasses && gymClasses.map((classItem: GymClass) => (
            <Card key={classItem.classID} className="bg-gradient-card border-0 shadow-card hover:shadow-athletic transition-athletic group">
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <CardTitle className="text-xl font-bold mb-2">{classItem.className}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        with {classItem.trainerName}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="text-sm font-medium">{classItem.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${getDifficultyColor(classItem.difficulty)}`}>
                    {classItem.difficulty}
                  </span>
                </div>
                
                <CardDescription className="text-sm leading-relaxed">
                  {classItem.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-accent" />
                    {classItem.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-accent" />
                    {classItem.capacity}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span className="text-xs">{classItem.time}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="athletic" className="flex-1">
                    Book Class
                  </Button>
                  <Button
                    variant="outline_athletic"
                    className="flex-1"
                    onClick={() => navigate(`/classes/${classItem.classID}`)}
                  >
                    View Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="hero" size="xl">
            View Full Schedule
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Classes;