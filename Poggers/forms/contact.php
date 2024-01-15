<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Coleta os dados do formulário
    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    // Aqui você pode fazer o que quiser com os dados, por exemplo, enviá-los por e-mail
    $to = "seu-email@example.com";
    $headers = "From: $email";

    mail($to, $subject, $message, $headers);

    // Resposta para o JavaScript
    $response = ["success" => true, "message" => "Sua mensagem foi enviada, obrigado!"];
    echo json_encode($response);
} else {
    // Se o método da solicitação não for POST, retorna um erro
    $response = ["success" => false, "message" => "Método não permitido"];
    echo json_encode($response);
}
?>
