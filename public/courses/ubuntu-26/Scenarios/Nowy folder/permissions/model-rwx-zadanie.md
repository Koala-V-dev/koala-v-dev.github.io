<data-permission-scenario
  id="rwx-02"
  title="Zadanie: ogranicz dostęp do raportu"
  file-name="raport-poufny.txt"
  file-type="file"
  owner-name="Jan"
  group-name="pracownicy"
  show-special="false"
>
  <initial
    owner-r="true" owner-w="true" owner-x="false"
    group-r="true"  group-w="true"  group-x="false"
    other-r="true"  other-w="false" other-x="false"
  />

  <identity id="owner" label="Jan (właściciel)" />
  <identity id="group" label="Marta (z grupy pracownicy)" />
  <identity id="other" label="Gość (inna grupa lub bez konta)" />

  <goal label="Ustaw uprawnienia tak, żeby tylko Jan mógł czytać i pisać. Marta i Gość nie powinni mieć żadnego dostępu.">
    <expect
      owner-r="true" owner-w="true" owner-x="false"
      group-r="false" group-w="false" group-x="false"
      other-r="false" other-w="false" other-x="false"
    />
  </goal>
</data-permission-scenario>
