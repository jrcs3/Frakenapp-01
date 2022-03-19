using ElectronCgi.DotNet;
using System;

namespace electron_cgi
{
    class Program
    {
        static void Main(string[] args)
        {
            var connection = new ConnectionBuilder()
                                .WithLogging()
                                .Build();

            // expects a request named "greeting" with a string argument and returns a string
            connection.On<string, string>("message", data =>
            {
                if (string.IsNullOrWhiteSpace(data))
                {
                    return "only static...";
                }
                if (data.ToLower().Trim() == "bye")
                {
                    return "hangup";
                }
                return $"You said \"{data}\"";
            });

            connection.Listen();
        }
    }
}
