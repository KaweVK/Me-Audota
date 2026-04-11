package kawe.vk.me_audota.model;

import jakarta.persistence.*;
import kawe.vk.me_audota.model.enums.Especie;
import kawe.vk.me_audota.model.enums.StatusPet;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pet")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Pet {

    @Id
    @Column(name = "id", updatable = false, nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private BigInteger id;
    @Column(name = "imagens_urls", nullable = false)
    private List<String> imagens;
    @Column(name = "nome", nullable = false, length = 150)
    private String nome;
    @Column(name = "descricao", nullable = false)
    private String descricao;
    @Column(name = "idade_mes", nullable = false)
    private BigInteger idadeMes;
    @Column(name = "idade_ano", nullable = false)
    private BigInteger idadeAno;
    @Enumerated(EnumType.STRING)
    @Column(name = "especie", length = 80, nullable = false)
    private Especie especie;
    @Column(name = "cor", nullable = false)
    private String cor;
    @Column(name = "sexo", length = 1)
    private String sexo;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 80,  nullable = false)
    private StatusPet status;
    @CreatedDate
    @Column(name = "register_date", nullable = false)
    private LocalDateTime registerDate;
    @LastModifiedDate
    @Column(name = "update_date", nullable = false)
    private LocalDateTime updateDate;

}
