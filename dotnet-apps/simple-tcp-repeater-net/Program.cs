using System;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace simple_tcp_repeater_net
{
    class Program
    {
        static void Main(string[] args)
        {
            TcpListener server = null;
            try
            {
                IPAddress iPAddress = IPAddress.Parse("127.0.0.1");
                int PORT = 3001;
                server = new TcpListener(iPAddress, PORT);

                server.Start();

                byte[] bytes = new byte[256];
                bool continueLoop = true;
                Console.WriteLine($"listening on {PORT}");
                while (continueLoop)
                {
                    TcpClient client = server.AcceptTcpClient();
                    NetworkStream stream = client.GetStream();

                    int i;
                    while ((i = stream.Read(bytes, 0, bytes.Length)) != 0)
                    {
                        string data = Encoding.ASCII.GetString(bytes, 0, i);
                        Console.WriteLine(data);
                        if (data.ToLower().Trim() == "bye")
                        {
                            // New Feature, End the process after sending
                            // terminal message to the client.
                            byte[] hangup = Encoding.ASCII.GetBytes("hangup");
                            stream.Write(hangup);
                            //continueLoop = false;
                            //break;
                        }
                        else
                        {
                            data = $"You said \"{data}\"";
                            byte[] message = Encoding.ASCII.GetBytes(data);
                            stream.Write(message);
                        }
                    }

                    client.Close();
                    Console.WriteLine("");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            finally
            {
                if (!(server is null))
                {
                    server.Stop();
                    Console.WriteLine("Stopped Listening");
                }
            }
        }
    }
}
