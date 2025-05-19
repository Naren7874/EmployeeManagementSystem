// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");

emp e = new emp();

Console.WriteLine(GC.GetGeneration(e));
GC.Collect();
Console.WriteLine(GC.GetGeneration(e));
GC.Collect();
Console.WriteLine(GC.GetGeneration(e));


class emp
{
    public emp()
    {
        Console.WriteLine("obje created ");

    }
    ~emp()
    {
        Console.WriteLine(" deleted");
    }
}