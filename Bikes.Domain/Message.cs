using Bikes.Domain;

public class Message
{
    public int MessageId { get; set; }
    public string Content { get; set; }
    public DateTime SentDate { get; set; }

    // Powiązanie z użytkownikiem (nazwa użytkownika jako autor)
    public string SenderId { get; set; }
    public string ReceiverId { get; set; } // Zawsze "Admin" dla administratora
    public User User { get; set; }
}
